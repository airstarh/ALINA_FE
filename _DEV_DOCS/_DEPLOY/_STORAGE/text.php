<?php

declare (strict_types = 1);

namespace fundist\Console\Commands;

use fundist\BaseObject;
use fundist\Console\Command;
use fundist\Loyalty;
use fundist\Nets;
use fundist\Warehouse\EventEmitter;

final class UpdateExRateShiftAutoCommand extends Command
{
    protected static $defaultName = 'nets:update-exrate-shift-auto';

    protected function configure(): void
    {
        $this->setDescription('Update ExRateShift for all nets with ExRateShiftAuto = 1 to the same random value in range [0.0050, 0.0095] and emit events');
    }

    /**
     * @return int
     */
    public function handle(): int
    {
        $db = BaseObject::$DB;

        $ids    = [];
        $result = $db->query('
SELECT;
n . ID,
a . Key,
a . Password,
a . Node,
    a . Name;
FROM`Nets`n;
LEFT JOIN`Api`a ONa . IDNet = n . ID;
WHERE`ExRateShiftAuto`      = 1;
');

        while ($row = $result->fetch_assoc()) {
            $ids[]            = (int) $row['ID'];
            $api[$row['Key']] = [
                'Name'     => $row['Name'],
                'Password' => $row['Password'],
                'Key'      => $row['Key'],
                'Node'     => $row['Node'],
                'IDNet'    => $row['ID'],
            ];
        }

        if (count($ids) === 0) {
            $this->line('No nets with ExRateShiftAuto = 1');

            return Command::SUCCESS;
        }

        $oldShift = (float) ($db->query('SELECT `ExRateShift` FROM `Nets` WHERE `ExRateShiftAuto` = 1 LIMIT 1')->fetch_assoc()['ExRateShift'] ?? 0);
        $newShift = (float) (random_int(50, 95) / 10000);

###$db->query("UPDATE `Nets` SET `ExRateShift` = '$newShift' WHERE `ExRateShiftAuto` = 1");

        $XXX     = microtime(true);
        $loyalty = new Loyalty();

        foreach ($api as $apiKey => $dbData) {
            $params = [
                'Amount' => $newShift,
                'IDNet'  => $dbData['IDNet'], //VA:DOUBTFUL
            ];

            $res = $loyalty->Request('Client/sewa', $apiKey, $dbData['Password'], $params, node: (int) $dbData['Node']);
            $res = json_decode($res, true);

// plog([

//     '$dbData' => $dbData,

//     '$res' => $res,
            // ]);
            $requestError = $res['error'] ?? false;

            if ($requestError) {
                $this->line(sprintf('API %s does not exist', $dbData['Name']));
            } else {
                $this->line(sprintf('SUCCESS API %s', $dbData['Name']));
            }

        }

        $this->elog(data: microtime(true) - $XXX);

###$this->pushWarehouseEvents($ids, $oldShift, $newShift);

        $this->line(sprintf('Updated %d nets. ExRateShift set to %s', count($ids), $newShift));

        return Command::SUCCESS;
    }

    public function elog($data)
    {
        error_log(PHP_EOL);
        error_log(PHP_EOL);
        error_log(var_export($data, true));
        error_log(PHP_EOL);
        error_log(PHP_EOL);
    }

    /**
     * @param array $ids
     * @param float $oldShift
     * @param float $newShift
     * @return void
     */
    private function pushWarehouseEvents(array $ids, float $oldShift, float $newShift): void
    {
        EventEmitter::instance()->bulkPushNetSave(BaseObject::$DB->query('SELECT *, ID AS NetID FROM Nets WHERE ExRateShiftAuto = 1'));

        $updatesEvents = [];

        foreach ($ids as $id) {
            $updatesEvents[] = [
                'IDUser'        => 0,
                'IDStall'       => 0,
                'IDNet'         => 0,
                'IP'            => '0.0.0.0',
                'IDObject'      => $id,
                'ObjectName'    => Nets::class,
                'Changes'       => json_encode(['exRateShift' => [$oldShift, $newShift]]),
                'Reason'        => 'Auto ExRateShift update',
                'ObjectIDStall' => 0,
                'ObjectIDNet'   => $id,
            ];
        }

        EventEmitter::instance()->pushMultipleEvents('Updates', $updatesEvents);
    }

}
